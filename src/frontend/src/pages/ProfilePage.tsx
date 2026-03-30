import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, CheckCircle, Loader2, User } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigation } from "../contexts/NavigationContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetCallerUserProfile, useSaveProfile } from "../hooks/useQueries";

export default function ProfilePage() {
  const { navigate } = useNavigation();
  const { identity } = useInternetIdentity();
  const { data: profile, isLoading } = useGetCallerUserProfile();
  const saveProfile = useSaveProfile();
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({ name: "", phone: "", address: "" });

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name,
        phone: profile.phone,
        address: profile.address,
      });
    }
  }, [profile]);

  const handleSave = async () => {
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error("Name and phone are required.");
      return;
    }
    try {
      await saveProfile.mutateAsync(form);
      setSaved(true);
      toast.success("Profile saved! प्रोफाइल सहेजी गई!");
      setTimeout(() => setSaved(false), 3000);
    } catch {
      toast.error("Failed to save profile.");
    }
  };

  if (!identity) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <User className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
        <p className="font-bold text-lg">Login required</p>
        <p className="text-muted-foreground text-sm">
          Please login to view your profile.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <button
        type="button"
        data-ocid="profile.back_button"
        onClick={() => navigate("home")}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-3xl shadow-card p-6"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center">
            <User className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-foreground">
              मेरी प्रोफाइल
            </h1>
            <p className="text-sm text-muted-foreground">My Profile</p>
          </div>
        </div>

        {isLoading ? (
          <div data-ocid="profile.loading_state" className="space-y-3">
            <div className="h-10 bg-muted rounded-xl animate-pulse" />
            <div className="h-10 bg-muted rounded-xl animate-pulse" />
            <div className="h-20 bg-muted rounded-xl animate-pulse" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="p-name" className="text-sm font-semibold">
                नाम / Full Name *
              </Label>
              <Input
                id="p-name"
                data-ocid="profile.name_input"
                placeholder="Your full name"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                className="rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="p-phone" className="text-sm font-semibold">
                फोन / Phone *
              </Label>
              <Input
                id="p-phone"
                data-ocid="profile.phone_input"
                placeholder="+91 XXXXX XXXXX"
                value={form.phone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, phone: e.target.value }))
                }
                className="rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="p-address" className="text-sm font-semibold">
                पता / Address
              </Label>
              <Textarea
                id="p-address"
                data-ocid="profile.address_textarea"
                placeholder="Delivery address"
                value={form.address}
                onChange={(e) =>
                  setForm((f) => ({ ...f, address: e.target.value }))
                }
                className="rounded-xl resize-none"
                rows={3}
              />
            </div>
            <div className="text-xs text-muted-foreground bg-muted rounded-xl p-3">
              🔐 Principal:{" "}
              <span className="font-mono">
                {identity.getPrincipal().toString().slice(0, 20)}...
              </span>
            </div>
            <Button
              data-ocid="profile.save_button"
              onClick={handleSave}
              disabled={saveProfile.isPending}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold rounded-2xl h-11"
            >
              {saveProfile.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : saved ? (
                <CheckCircle className="w-4 h-4 mr-2" />
              ) : null}
              {saved ? "Saved!" : "Save Profile"}
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
