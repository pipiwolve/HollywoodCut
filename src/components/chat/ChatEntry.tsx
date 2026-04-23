import type { ReactNode } from 'react';
import { useChatStore } from '../../store/useChatStore';
import type { ConversationSeed } from '../../types/domain';

interface ChatEntryRenderProps {
    openConversation: () => void;
}

interface ChatEntryProps {
    seed: ConversationSeed;
    children: (props: ChatEntryRenderProps) => ReactNode;
}

export default function ChatEntry({ seed, children }: ChatEntryProps) {
    const openConversation = useChatStore((state) => state.openConversation);

    return <>{children({ openConversation: () => openConversation(seed) })}</>;
}
