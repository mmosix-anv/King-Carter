import { useEffect } from "react";

export default function Test() {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://book.mylimobiz.com/v4/widgets/widget-loader.js";
    document.body.appendChild(script);
    return () => { script.remove(); };
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <a
        href="https://book.mylimobiz.com/v4/kingandcarter"
        data-ores-widget="website"
        data-ores-alias="kingandcarter"
      >
        Online Reservations
      </a>
    </div>
  );
}
