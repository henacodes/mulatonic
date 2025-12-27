export default function SiteInfo({
  logoSrc = "/mulatu.png",
  githubUrl = "https://github.com/henacodes/mulatonic",
}) {
  return (
    <div
      className="
      fixed bottom-[2vw] right-[2vw] z-100
      bg-none 
      rounded-2xl  px-4 py-2
      flex items-center gap-2 text-base
    "
    >
      <div className="  flex items-center mx-4 gap-2">
        <img
          src={logoSrc}
          alt="Mulatonic Logo"
          width={30}
          height={30}
          className="rounded-full bg-primary  object-cover shadow"
          style={{ padding: "4px" }}
        />
        <span className="font-bold tracking-wide text-primary text-lg font-sans">
          Mulatonic
        </span>
      </div>
      <a
        href={githubUrl}
        className="ml-1 flex items-center"
        title="View on GitHub"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg"
          alt="GitHub"
          width={22}
          height={22}
          className="inline align-middle    "
          style={{ filter: "invert(100%) brightness(2)" }}
        />
      </a>
    </div>
  );
}
