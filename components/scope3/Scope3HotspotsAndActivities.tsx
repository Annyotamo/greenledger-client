"use client";

import { motion } from "framer-motion";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { VENDOR_HOTSPOTS, SCOPE3_RECENT_ACTIVITIES } from "@/lib/scope3/data";
import { cn } from "@/lib/utils/cn";

const listVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 6 },
    show: { opacity: 1, y: 0 },
};

