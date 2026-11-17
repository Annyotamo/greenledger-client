import { redirect } from "next/navigation";

export default function BrsrEnergyRedirectPage() {
    redirect("/brsr?section=env-energy");
}
