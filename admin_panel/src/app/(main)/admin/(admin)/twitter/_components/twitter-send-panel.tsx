// =============================================================
// FILE: src/app/(main)/admin/(admin)/twitter/_components/twitter-send-panel.tsx
// Manual tweet send panel
// =============================================================

'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';
import { toast } from 'sonner';

import { useAdminT } from '@/app/(main)/admin/_components/common/use-admin-t';
import { useListAssetsAdminQuery, useTwitterSendMutation } from '@/integrations/hooks';
import { TWEET_MAX_LENGTH, buildTweetUrl, getErrorMessage } from '@/integrations/shared';
import { TwitterTweetCard } from './twitter-tweet-card';

const NO_MEDIA = '__none__';

function joinTweet(body: string, hashtags: string) {
  return [body.trim(), hashtags.trim()].filter(Boolean).join('\n\n');
}

export default function TwitterSendPanel() {
  const t = useAdminT('admin.twitter');
  const [twitterSend, { isLoading: sending }] = useTwitterSendMutation();
  const [text, setText] = React.useState('');
  const [hashtags, setHashtags] = React.useState('#VistaSeeds #yerlitohum');
  const [mediaUrl, setMediaUrl] = React.useState<string | null>(null);
  const { data: mediaData, isLoading: mediaLoading } = useListAssetsAdminQuery({
    bucket: 'default',
    folder: 'twitter/vistaseeds',
    mime: 'image',
    limit: 50,
    sort: 'name',
    order: 'asc',
  });

  const trimmed = joinTweet(text, hashtags);
  const overLimit = trimmed.length > TWEET_MAX_LENGTH;
  const canSend = trimmed.length > 0 && !overLimit && !sending;
  const mediaItems = mediaData?.items ?? [];

  const handleSend = async () => {
    if (!canSend) return;
    if (!window.confirm(t('send.confirm'))) return;

    try {
      const res = await twitterSend({ text: trimmed, media_url: mediaUrl }).unwrap();
      toast.success(`${t('send.sent')} — ${buildTweetUrl(res.tweet_id)}`);
      setText('');
      setMediaUrl(null);
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
        <div className="space-y-2">
          <Label>{t('send.bodyLabel')}</Label>
          <Textarea
            rows={6}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t('send.placeholder')}
          />
        </div>

        <div className="space-y-2">
          <Label>{t('send.hashtagsLabel')}</Label>
          <Textarea
            rows={2}
            value={hashtags}
            onChange={(e) => setHashtags(e.target.value)}
            placeholder="#VistaSeeds #yerlitohum"
          />
        </div>

        <div className="space-y-2">
          <Label>{t('send.mediaLabel')}</Label>
          <Select
            value={mediaUrl || NO_MEDIA}
            onValueChange={(value) => setMediaUrl(value === NO_MEDIA ? null : value)}
            disabled={mediaLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder={mediaLoading ? t('send.mediaLoading') : t('send.mediaPlaceholder')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NO_MEDIA}>{t('send.noMedia')}</SelectItem>
              {mediaItems.map((item) => (
                <SelectItem key={item.id} value={item.url || `/uploads/${item.path}`}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {trimmed ? (
          <TwitterTweetCard
            mode="preview"
            item={{
              id: 'manual-preview',
              title: t('send.previewTitle'),
              template: 'manual',
              slot_label: t('send.previewTime'),
              content: trimmed,
              media_url: mediaUrl,
            }}
          />
        ) : null}

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
