// =============================================================
// FILE: src/app/(main)/admin/(admin)/twitter/_components/twitter-send-panel.tsx
// Manual tweet send panel
// =============================================================

'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';
import { toast } from 'sonner';

import { useAdminT } from '@/app/(main)/admin/_components/common/use-admin-t';
import { useTwitterSendMutation } from '@/integrations/hooks';
import { TWEET_MAX_LENGTH, buildTweetUrl, getErrorMessage } from '@/integrations/shared';

export default function TwitterSendPanel() {
  const t = useAdminT('admin.twitter');
  const [twitterSend, { isLoading: sending }] = useTwitterSendMutation();
  const [text, setText] = React.useState('');

  const trimmed = text.trim();
  const overLimit = trimmed.length > TWEET_MAX_LENGTH;
  const canSend = trimmed.length > 0 && !overLimit && !sending;

  const handleSend = async () => {
    if (!canSend) return;
    if (!window.confirm(t('send.confirm'))) return;

    try {
      const res = await twitterSend({ text: trimmed }).unwrap();
      toast.success(`${t('send.sent')} — ${buildTweetUrl(res.tweet_id)}`);
      setText('');
    } catch (err) {
      toast.error(`${t('send.failed')}: ${getErrorMessage(err)}`);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('send.title')}</CardTitle>
        <CardDescription>{t('send.description')}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <Textarea
          rows={6}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t('send.placeholder')}
        />

        <div className="flex items-center justify-between gap-3">
          <span
            className={`text-xs ${overLimit ? 'text-destructive' : 'text-muted-foreground'}`}
          >
            {trimmed.length} / {TWEET_MAX_LENGTH}
          </span>

          <Button onClick={handleSend} disabled={!canSend} className="gap-2">
            <Send className="h-4 w-4" />
            {sending ? t('send.sending') : t('send.submit')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
