import {getShortExpiryProductEntries} from "@dal";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import Link from "next/link";
import DeleteProductButton from "@/components/custom/products/deleteProductButton";
import {getSessionProfileOrRedirect} from "@mediators";
import {Button} from "@/components/ui/button";
import {Eye} from "lucide-react";
import ExpiringEntriesList from "@/components/custom/products/expiringEntriesList";

export default async function ShortExpiryPage() {
    const profile = await getSessionProfileOrRedirect()
    const productEntries = await getShortExpiryProductEntries(profile.groupId)

    return (
            <ExpiringEntriesList productEntries={productEntries}/>
    )
}