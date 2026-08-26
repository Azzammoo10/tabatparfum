import { cn } from "@/lib/utils";
import Placeholder from "./Placeholder";

interface ProductImageProps {
  src?: string | null;
  alt: string;
  label: string;
  className?: string;
  aspect?: string;
  fitMode?: "cover" | "contain";
}

const ProductImage = ({
  src,
  alt,
  label,
  className,
  aspect = "aspect-square",
  fitMode = "contain",
}: ProductImageProps) => {
  if (!src) {
    return <Placeholder label={label} className={className} aspect={aspect} />;
  }

  return (
    <div
      className={cn(
        "group/img relative w-full overflow-hidden rounded-2xl flex items-center justify-center bg-transparent dark:bg-white/10 dark:backdrop-blur-sm p-1 transition-all",
        aspect,
        className
      )}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={cn(
          "w-full h-full transition-transform duration-700 ease-out group-hover/img:scale-105 animate-fade-in mix-blend-multiply dark:mix-blend-normal dark:filter dark:brightness-110",
          fitMode === "cover" ? "object-cover" : "object-contain p-1"
        )}
      />
    </div>
  );
};

export default ProductImage;
