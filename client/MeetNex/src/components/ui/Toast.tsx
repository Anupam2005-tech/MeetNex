import { toast } from "sonner";
import { 
  Zap, 
  ShieldAlert, 
  Terminal, 
  RefreshCcw,
  Volume2, VolumeX, Eye, EyeOff 
} from "lucide-react"; 

const iconSize = "h-5 w-5";

export const showToast = {
  // Sassy Success
  success: (msg: string, desc?: string) => {
    toast.success(msg, {
      description: desc,
      icon: <Zap className={`${iconSize} text-emerald-400`} />,
    });
  },

  // Sassy Error
  error: (msg: string, desc?: string) => {
    toast.error(msg, {
      description: desc,
      icon: <ShieldAlert className={`${iconSize} text-rose-400`} />,
    });
  },

  // Sassy Info (Aligned with your UI)
  info: (msg: string, desc?: string) => {
    toast.info(msg, {
      description: desc,
      icon: <Terminal className={`${iconSize} text-sky-400`} />,
    });
  },

  // Specialized Sassy Media Logic
  media: (type: 'mic' | 'video', isActive: boolean) => {
    if (type === 'mic') {
      isActive 
        ? toast.success("VOICE LIVE", { 
            description: "Channel open. They can hear you.",
            icon: <Volume2 className={`${iconSize} text-emerald-400`} /> 
          })
        : toast.error("MIC SILENCED", { 
            description: "Privacy mode active.",
            icon: <VolumeX className={`${iconSize} text-rose-400`} /> 
          });
    } else {
      isActive 
        ? toast.success("SIGHT ON", { 
            description: "Camera feed broadcasting.",
            icon: <Eye className={`${iconSize} text-emerald-400`} /> 
          })
        : toast.error("SIGHT OFF", { 
            description: "Visuals encrypted.",
            icon: <EyeOff className={`${iconSize} text-rose-400`} /> 
          });
    }
  },

  // Loading state with Sassy terminal feel
  promise: (promise: Promise<any>) => {
    toast.promise(promise, {
      loading: "EXECUTING COMMAND...",
      success: "ACTION VERIFIED",
      error: "COMMAND FAILED",
      icon: <RefreshCcw className={`${iconSize} animate-spin text-cyan-400`} />,
    });
  }
};