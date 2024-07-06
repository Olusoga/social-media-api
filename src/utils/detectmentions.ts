export const detectMentions = (content: string): string[] => {
    const mentionRegex = /@(\w+)/g;
    const mentionedUserIds: string[] = [];
    
    let match: RegExpExecArray | null;
    
    while ((match = mentionRegex.exec(content)) !== null) {
      const userId = match[1]; 
      mentionedUserIds.push(userId);
    }
    
    return mentionedUserIds;
  };