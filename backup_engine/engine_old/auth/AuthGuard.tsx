import { ReactNode } from "react";

interface Props {
    children: ReactNode;
}

export function AuthGuard({ children }: Props) {
    return <>{children}</>;
}












