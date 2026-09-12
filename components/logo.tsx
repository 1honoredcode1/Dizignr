import Link from "next/link";

const Logo = () => {
  return (
    <Link href="/" className="flex-1 flex items-center text-2xl">
      <span className="inline-block font-extrabold text-primary">D</span>
      <span className="font-semibold text-foreground">izignr</span>
    </Link>
  );
};

export default Logo;
