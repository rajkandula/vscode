---
title: Chat Architecture
---

# Chat Architecture

This document outlines the flow of a chat request.

The chat flow is: editor context → API request → response rendering.

## Request and Response

```mermaid
sequenceDiagram
    participant Editor as Editor
    participant Service as ChatService
    participant API as LanguageModelAPI
    participant View as ChatUI

    Editor->>Service: Gather context
    Service->>API: Send request
    API-->>Service: Return response
    Service-->>View: Render message
```

## Error Handling

```mermaid
sequenceDiagram
    participant Editor as Editor
    participant Service as ChatService
    participant API as LanguageModelAPI
    participant View as ChatUI

    Editor->>Service: Gather context
    Service->>API: Send request
    API--x Service: Error
    Service-->>View: Display error
```

## Related Services and Modules

- `src/vs/workbench/contrib/chat/common/chatService.ts`
- `src/vs/workbench/contrib/chat/common/chatServiceImpl.ts`
- `src/vs/workbench/contrib/chat/browser/chatWidget.ts`
- `src/vs/workbench/contrib/chat/browser/chatViewPane.ts`

