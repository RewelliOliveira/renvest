import { Button } from "@/components/ui/button";
import { StarBurst } from "@/components/ui/starsUI";

export function Login() {
  return (
    <StarBurst className="min-h-screen" maxHeightPercent={42}>
      <section>
        <Button />
      </section>
      <section>
        <div>
          <img src="/Mascot.svg" alt="Mascote" />
          <span className="flex gap-2">
            Entre na <img className="" src="/Logomarca.svg" alt="Logomarca" />
          </span>
        </div>
      </section>
    </StarBurst>
  );
}
