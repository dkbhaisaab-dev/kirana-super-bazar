import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Store } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useSaveProfile } from "../hooks/useQueries";

export default function ProfileSetupModal() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const saveProfile = useSaveProfile();

  const handleSubmit = async () => {
    if (!name.trim() || !phone.trim()) {
      toast.error("Please fill in your name and phone number.");
      return;
    }
    try {
      await saveProfile.mutateAsync({
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
      });
      toast.success("प्रोफाइल सहेजी गई! Profile saved!");
    } catch {
      toast.error("Failed to save profile. Please try again.");
    }
  };

  return (
    <Dialog open={true}>
      <DialogContent
        data-ocid="profile_setup.dialog"
        className="max-w-sm rounded-3xl"
        showCloseButton={false}
      >
        <DialogHeader className="items-center text-center">
          <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mb-2">
            <Store className="w-7 h-7 text-white" />
          </div>
          <DialogTitle className="text-xl font-bold">
            स्वागत है! Welcome!
          </DialogTitle>
          <DialogDescription className="text-sm">
            Please set up your profile to continue shopping.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 pt-2">
          <div className="space-y-1">
            <Label htmlFor="setup-name" className="text-sm font-semibold">
              नाम / Name *
            </Label>
            <Input
              id="setup-name"
              data-ocid="profile_setup.input"
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="setup-phone" className="text-sm font-semibold">
              फोन / Phone *
            </Label>
            <Input
              id="setup-phone"
              data-ocid="profile_setup.phone_input"
              placeholder="+91 XXXXX XXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="setup-address" className="text-sm font-semibold">
              पता / Address
            </Label>
            <Textarea
              id="setup-address"
              data-ocid="profile_setup.textarea"
              placeholder="Your delivery address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="rounded-xl resize-none"
              rows={2}
            />
          </div>
          <Button
            data-ocid="profile_setup.submit_button"
            onClick={handleSubmit}
            disabled={saveProfile.isPending}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold rounded-2xl h-11"
          >
            {saveProfile.isPending && (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            )}
            Save & Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
