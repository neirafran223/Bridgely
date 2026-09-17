export default function BackgroundDecor() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F0F2FF] via-[#F4F7FE] to-[#E8F4F8]" />

      {/* Animated mesh orbs */}
      <div className="mesh-orb-1 absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#787FF6]/20 via-[#B8B5FF]/15 to-transparent blur-3xl" />
      <div className="mesh-orb-2 absolute top-1/4 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-[#4ADEDE]/15 via-[#7BD5F5]/10 to-transparent blur-3xl" />
      <div className="mesh-orb-3 absolute bottom-0 left-1/4 w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-[#1CA7EC]/12 via-[#B8B5FF]/8 to-transparent blur-3xl" />

      {/* Subtle accent orbs */}
      <div className="mesh-orb-2 absolute top-2/3 -left-20 w-[300px] h-[300px] rounded-full bg-[#7DFFCD]/8 blur-3xl animate-pulse-glow" />
      <div className="mesh-orb-1 absolute top-1/3 right-1/4 w-[250px] h-[250px] rounded-full bg-[#FF7B7B]/6 blur-3xl animate-pulse-glow" style={{ animationDelay: "2s" }} />

      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #1F2F98 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />
    </div>
  );
}
