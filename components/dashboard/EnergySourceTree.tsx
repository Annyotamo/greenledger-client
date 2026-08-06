import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import type { EnergySourceNode } from "@/lib/dashboard/types";

type EnergySourceTreeProps = {
    nodes: EnergySourceNode[];
};

export function EnergySourceTree({ nodes }: EnergySourceTreeProps) {
    return (
        <Card className="flex h-full flex-col overflow-hidden">
            <CardHeader tone="flat">
                <div className="flex items-center gap-2.5">
                    <MaterialIcon name="account_tree" size="sm" className="text-primary" />
                    <div>
                        <h3 className="text-headline-sm font-semibold text-primary">Source Breakdown Tree</h3>
                        <p className="font-mono text-[10px] uppercase tracking-tighter text-on-surface-variant">
                            Hierarchical Energy Flow Logs
                        </p>
                    </div>
                </div>
            </CardHeader>

            <CardBody className="flex flex-1 flex-col gap-6 overflow-y-auto p-card-padding">
                <div className="space-y-5">
                    {nodes.map((node) => (
                        <div key={node.label} className="space-y-4">
                            <div className="flex items-center justify-between gap-4 text-sm font-bold text-secondary">
                                <span>{node.label}</span>
                                <span>
                                    {node.value.toLocaleString("en-US", { maximumFractionDigits: 1 })} {node.unit}
                                </span>
                            </div>
                            {node.children ? (
                                <div className="space-y-4 border-l border-outline-variant/40 pl-5">
                                    {node.children.map((child) => (
                                        <SourceNode key={child.label} node={child} depth={1} />
                                    ))}
                                </div>
                            ) : (
                                node.note && (
                                    <div className="text-[10px] italic text-on-surface-variant">{node.note}</div>
                                )
                            )}
                        </div>
                    ))}
                </div>
            </CardBody>
        </Card>
    );
}

function SourceNode({ node, depth }: { node: EnergySourceNode; depth: number }) {
    return (
        <div className={depth > 0 ? "space-y-3" : "space-y-2"}>
            <div className="tree-line tree-line-vertical flex items-center justify-between gap-3 text-[11px] text-on-surface-variant">
                <span>{node.label}</span>
                <span className="font-medium text-on-surface font-mono">
                    {node.value.toLocaleString("en-US", { maximumFractionDigits: 1 })} {node.unit}
                </span>
            </div>
            {node.children && (
                <div className="space-y-3 border-l border-outline-variant/40 pl-5">
                    {node.children.map((child) => (
                        <SourceNode key={child.label} node={child} depth={depth + 1} />
                    ))}
                </div>
            )}
            {node.note && <div className="ml-5 text-[10px] italic text-on-surface-variant">{node.note}</div>}
        </div>
    );
}
