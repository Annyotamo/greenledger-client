import { redirect } from "next/navigation";

export default function BrsrAirRedirectPage() {
    redirect("/brsr?section=env-air");
}