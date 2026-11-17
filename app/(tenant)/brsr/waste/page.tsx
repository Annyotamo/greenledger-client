import { redirect } from "next/navigation";

export default function BrsrWasteRedirectPage() {
    redirect("/brsr?section=env-waste");
}
