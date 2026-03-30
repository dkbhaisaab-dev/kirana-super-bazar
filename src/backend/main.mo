import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Order "mo:core/Order";
import Text "mo:core/Text";
import List "mo:core/List";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  include MixinStorage();

  // DEFINITIONS
  // Admin system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile type
  public type UserProfile = {
    name : Text;
    phone : Text;
    address : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // Product type
  public type Product = {
    id : Nat;
    name : Text;
    nameHindi : Text;
    category : Text;
    price : Nat;
    unit : Text;
    stock : Nat;
    imageUrl : Text;
    description : Text;
    isAvailable : Bool;
  };

  type ProductInput = {
    name : Text;
    nameHindi : Text;
    category : Text;
    price : Nat;
    unit : Text;
    stock : Nat;
    imageUrl : Text;
    description : Text;
  };

  // Order type
  public type Order = {
    id : Nat;
    customerId : Principal;
    items : [{
      productId : Nat;
      quantity : Nat;
      price : Nat;
    }];
    total : Nat;
    deliveryAddress : Text;
    status : {
      #pending;
      #confirmed;
      #outForDelivery;
      #delivered;
      #cancelled;
    };
    createdAt : Int;
  };

  // Storage
  var nextProductId = 1;
  var nextOrderId = 1;
  let products = Map.empty<Nat, Product>();
  let orders = Map.empty<Nat, Order>();
  var initialized = false;

  // Initialization - Seed data
  public type SeedProduct = (ProductInput, Nat);
  let seedProducts : [SeedProduct] = [
    ({
      name = "Rice";
      nameHindi = "चावल";
      category = "Grains";
      price = 50;
      unit = "kg";
      stock = 1000;
      imageUrl = "https://kirana.co/images/rice.jpg";
      description = "Premium quality rice";
    }, 1000),
    ({
      name = "Dal";
      nameHindi = "दाल";
      category = "Pulses";
      price = 40;
      unit = "kg";
      stock = 800;
      imageUrl = "https://kirana.co/images/dal.jpg";
      description = "High protein dal";
    }, 800),
    ({
      name = "Milk";
      nameHindi = "दूध";
      category = "Dairy";
      price = 55;
      unit = "litre";
      stock = 500;
      imageUrl = "https://kirana.co/images/milk.jpg";
      description = "Fresh cow milk";
    }, 500),
    ({
      name = "Tea";
      nameHindi = "चाय";
      category = "Beverages";
      price = 250;
      unit = "kg";
      stock = 300;
      imageUrl = "https://kirana.co/images/tea.jpg";
      description = "Premium tea leaves";
    }, 300),
    ({
      name = "Sugar";
      nameHindi = "शक्कर";
      category = "Sweeteners";
      price = 36;
      unit = "kg";
      stock = 600;
      imageUrl = "https://kirana.co/images/sugar.jpg";
      description = "Pure white sugar";
    }, 600),
    ({
      name = "Salt";
      nameHindi = "नमक";
      category = "Spices";
      price = 20;
      unit = "kg";
      stock = 400;
      imageUrl = "https://kirana.co/images/salt.jpg";
      description = "Iodized salt";
    }, 400),
    ({
      name = "Atta";
      nameHindi = "आटा";
      category = "Flour";
      price = 32;
      unit = "kg";
      stock = 700;
      imageUrl = "https://kirana.co/images/atta.jpg";
      description = "Wheat flour";
    }, 700),
    ({
      name = "Mustard Oil";
      nameHindi = "सरसों का तेल";
      category = "Oils";
      price = 150;
      unit = "litre";
      stock = 300;
      imageUrl = "https://kirana.co/images/mustard_oil.jpg";
      description = "Pure mustard oil";
    }, 300),
    ({
      name = "Biscuits";
      nameHindi = "बिस्कुट";
      category = "Snacks";
      price = 30;
      unit = "pack";
      stock = 200;
      imageUrl = "https://kirana.co/images/biscuits.jpg";
      description = "Crispy biscuits";
    }, 200),
    ({
      name = "Soap";
      nameHindi = "साबुन";
      category = "Personal Care";
      price = 25;
      unit = "bar";
      stock = 150;
      imageUrl = "https://kirana.co/images/soap.jpg";
      description = "Gentle cleansing soap";
    }, 150),
  ];

  // VIEWS
  public shared ({ caller }) func init() : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can initialize");
    };
    if (not initialized) {
      for ((productInput, stock) in seedProducts.vals()) {
        let id = nextProductId;
        let newProduct : Product = {
          id;
          name = productInput.name;
          nameHindi = productInput.nameHindi;
          category = productInput.category;
          price = productInput.price;
          unit = productInput.unit;
          stock = stock;
          imageUrl = productInput.imageUrl;
          description = productInput.description;
          isAvailable = true;
        };
        products.add(id, newProduct);
        nextProductId += 1;
      };
      initialized := true;
    };
  };

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Product management
  public shared ({ caller }) func addProduct(productInput : ProductInput) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add products");
    };
    let id = nextProductId;
    let product : Product = {
      id;
      name = productInput.name;
      nameHindi = productInput.nameHindi;
      category = productInput.category;
      price = productInput.price;
      unit = productInput.unit;
      stock = productInput.stock;
      imageUrl = productInput.imageUrl;
      description = productInput.description;
      isAvailable = true;
    };
    products.add(id, product);
    nextProductId += 1;
  };

  public shared ({ caller }) func updateProduct(id : Nat, input : ProductInput) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?existing) {
        let updatedProduct : Product = {
          id;
          name = input.name;
          nameHindi = input.nameHindi;
          category = input.category;
          price = input.price;
          unit = input.unit;
          stock = input.stock;
          imageUrl = input.imageUrl;
          description = input.description;
          isAvailable = existing.isAvailable;
        };
        products.add(id, updatedProduct);
      };
    };
  };

  public shared ({ caller }) func deleteProduct(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };
    if (not products.containsKey(id)) {
      Runtime.trap("Product not found");
    };
    products.remove(id);
  };

  public query func getProducts() : async [Product] {
    let productList = List.empty<Product>();
    for ((id, product) in products.entries()) {
      if (product.isAvailable) {
        productList.add(product);
      };
    };
    productList.toArray();
  };

  public query func getProduct(id : Nat) : async Product {
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) { product };
    };
  };

  // Orders
  public shared ({ caller }) func placeOrder(items : [{ productId : Nat; quantity : Nat }], deliveryAddress : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can place orders");
    };

    // Create order items with prices
    let orderItems = List.empty<{ productId : Nat; quantity : Nat; price : Nat }>();
    var total : Nat = 0;

    for (inputItem in items.vals()) {
      switch (products.get(inputItem.productId)) {
        case (null) { Runtime.trap("Product not found") };
        case (?product) {
          if (not product.isAvailable) {
            Runtime.trap("Product not available");
          };
          if (product.stock < inputItem.quantity) {
            Runtime.trap("Insufficient stock for product: " # product.name);
          };
          let orderItem = {
            productId = inputItem.productId;
            quantity = inputItem.quantity;
            price = product.price;
          };
          orderItems.add(orderItem);
          total += product.price * inputItem.quantity;

          // Update stock
          let updatedProduct : Product = {
            product with
            stock = product.stock - inputItem.quantity;
          };
          products.add(inputItem.productId, updatedProduct);
        };
      };
    };

    let orderId = nextOrderId;
    let order : Order = {
      id = orderId;
      customerId = caller;
      items = orderItems.toArray();
      total;
      deliveryAddress;
      status = #pending;
      createdAt = Time.now();
    };

    orders.add(orderId, order);
    nextOrderId += 1;
    orderId;
  };

  // Filter orders for a specific customer ID
  func filterOrdersByCustomerId(customerId : Principal) : [Order] {
    let orderList = List.empty<Order>();
    for ((orderId, order) in orders.entries()) {
      if (order.customerId == customerId) {
        orderList.add(order);
      };
    };
    orderList.toArray();
  };

  public query ({ caller }) func getMyOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view their orders");
    };
    filterOrdersByCustomerId(caller);
  };

  public query ({ caller }) func getCustomerOrders(customerId : Principal) : async [Order] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view customer orders");
    };
    filterOrdersByCustomerId(customerId);
  };

  // Get all orders - admin only
  public query ({ caller }) func getAllOrders() : async [Order] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all orders");
    };
    orders.values().toArray();
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Nat, status : { #pending; #confirmed; #outForDelivery; #delivered; #cancelled }) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update order status");
    };
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        // Only allow cancelling if order is not already "delivered"
        if (status == #cancelled and order.status == #delivered) {
          Runtime.trap("Cannot cancel delivered orders");
        };
        let updatedOrder : Order = { order with status };
        orders.add(orderId, updatedOrder);
      };
    };
  };

  // Get all products in a specific category
  public query func getProductsByCategory(category : Text) : async [Product] {
    let productList = List.empty<Product>();
    for ((id, product) in products.entries()) {
      if (product.category == category and product.isAvailable) {
        productList.add(product);
      };
    };
    productList.toArray();
  };

  public query func searchProducts(searchTerm : Text) : async [Product] {
    let productList = List.empty<Product>();
    for ((id, product) in products.entries()) {
      let name = product.name;
      if (name.contains(#text searchTerm) and product.isAvailable) {
        productList.add(product);
      };
    };
    productList.toArray();
  };
};
