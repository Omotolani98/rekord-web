/* ────────────────────────────────────────────────────────────────────
   CliReference — command tree rendered as reference cards
   ──────────────────────────────────────────────────────────────────── */
import { COMMON_FLAGS, REKORD_CLI } from "@/lib/cli";

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function synHi(s: string) {
  return esc(s).replace(/(--[a-z-]+)/g, '<span class="fl">$1</span>');
}

export default function CliReference() {
  return (
    <div id="cliHost">
      <div className="callout note">
        <div className="ch">▋ common flags</div>
        <p>
          Most session commands also accept{" "}
          {COMMON_FLAGS.map((f, i) => (
            <span key={f[0]}>
              <code className="ic">{f[0]}</code>
              {i < COMMON_FLAGS.length - 1 ? " and " : ""}
            </span>
          ))}
          {" "}— {COMMON_FLAGS.map((f) => f[1].replace(/\.$/, "")).join("; ").toLowerCase()}.
        </p>
      </div>
      {REKORD_CLI.map((grp) => (
        <div className="cli-group" key={grp.label}>
          <p className="cgl">{grp.label}</p>
          {grp.commands.map((c) => {
            const anchor = "cmd-" + c.name.replace(/\s+/g, "-");
            return (
              <div className="cli-card" id={anchor} key={anchor}>
                <div className="name">
                  <span className="accent">rekord</span> {c.name}
                </div>
                <p className="purpose">{c.purpose}</p>
                <div className="syn">
                  <span className="pr">$ </span>
                  <span dangerouslySetInnerHTML={{ __html: synHi(c.synopsis) }} />
                  <button className="copy-btn" data-copy={c.synopsis} />
                </div>
                {c.flags.length > 0 && (
                  <table className="flags">
                    <thead>
                      <tr>
                        <th>flag</th>
                        <th>description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {c.flags.map((f) => (
                        <tr key={f[0]}>
                          <td className="f">{f[0]}</td>
                          <td className="d">{f[1]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
