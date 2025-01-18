import { Button } from "@/components/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/components/ui/dialog";
import { Instagram, Linkedin, Github, MessageSquare } from "lucide-react"; // Import ikon dari lucide-react

export function SocialMediaDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Connect With Me</Button>
      </DialogTrigger>
      <DialogContent >
        <DialogHeader>
          <DialogTitle>Social Media</DialogTitle>
          <DialogDescription>
            Connect with me on various social media platforms.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Instagram Button */}
          <Button
            variant="outline"
            className="flex items-center justify-start gap-2"
            onClick={() => window.open("https://www.instagram.com/yourusername", "_blank")}
          >
            <Instagram className="h-4 w-4" /> {/* Ikon Instagram */}
            Instagram
          </Button>

          {/* LinkedIn Button */}
          <Button
            variant="outline"
            className="flex items-center justify-start gap-2"
            onClick={() => window.open("https://www.linkedin.com/in/yourusername", "_blank")}
          >
            <Linkedin className="h-4 w-4" /> {/* Ikon LinkedIn */}
            LinkedIn
          </Button>

          {/* GitHub Button */}
          <Button
            variant="outline"
            className="flex items-center justify-start gap-2"
            onClick={() => window.open("https://github.com/yourusername", "_blank")}
          >
            <Github className="h-4 w-4" /> {/* Ikon GitHub */}
            GitHub
          </Button>

          {/* Threads Button */}
          <Button
            variant="outline"
            className="flex items-center justify-start gap-2"
            onClick={() => window.open("https://threads.net/yourusername", "_blank")}
          >
            <MessageSquare className="h-4 w-4" /> {/* Ikon Threads (gunakan ikon pesan sebagai alternatif) */}
            Threads
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}