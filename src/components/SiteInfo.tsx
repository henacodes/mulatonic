export default function SiteInfo({
  logoSrc = "/mulatu.png",
  githubUrl = "https://github.com/henacodes/mulatonic",
}) {
  return (
    <div
      className="
      fixed bottom-[2vw] right-[2vw] z-[9999]
      bg-secondary
      rounded-2xl shadow-lg px-4 py-2
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
          src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/github.svg"
          alt="GitHub"
          width={22}
          height={22}
          className="inline align-middle"
          style={{ filter: "invert(15%) brightness(0.5)" }}
        />
      </a>
    </div>
  );
}
