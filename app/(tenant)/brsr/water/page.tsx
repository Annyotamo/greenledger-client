import { redirect } from "next/navigation";

export default function BrsrWaterRedirectPage() {
    redirect("/brsr?section=env-water");
}
