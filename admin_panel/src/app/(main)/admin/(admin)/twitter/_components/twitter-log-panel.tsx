"use client";

import { RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { useAdminT } from "@/app/(main)/admin/_components/common/use-admin-t";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTwitterCancelTweetMutation, useTwitterListTweetsQuery } from "@/integrations/hooks";
import type { TweetLogRow, TweetStatus } from "@/integrations/shared";

import { TwitterTweetCard } from "./twitter-tweet-card";

const LIMIT = 50;

type TwitterLogPanelProps = {
  scope: "queue" | "history";
};

function byNewest(a: TweetLogRow, b: TweetLogRow) {
  const aTime = Date.parse(a.posted_at || a.scheduled_at || a.created_at);
  const bTime = Date.parse(b.posted_at || b.scheduled_at || b.created_at);
  return bTime - aTime;
}

function useRows(statuses: TweetStatus[]) {
  const queued = useTwitterListTweetsQuery({ status: "queued", limit: LIMIT });
  const posting = useTwitterListTweetsQuery({ status: "posting", limit: LIMIT });
  const sent = useTwitterListTweetsQuery({ status: "sent", limit: LIMIT });
  const failed = useTwitterListTweetsQuery({ status: "failed", limit: LIMIT });
  const canceled = useTwitterListTweetsQuery({ status: "canceled", limit: LIMIT });

  const queries = { queued, posting, sent, failed, canceled };
  const active = statuses.map((status) => queries[status]);
  const rows = active.flatMap((query) => query.data?.items ?? []).sort(byNewest);

  return {
    rows,
    isLoading: active.some((query) => query.isLoading),
    isFetching: active.some((query) => query.isFetching),
    refetch: () => active.forEach((query) => void query.refetch()),
  };
}

export default function TwitterLogPanel({ scope }: TwitterLogPanelProps) {
  const t = useAdminT("admin.twitter");
  const statuses: TweetStatus[] = scope === "queue" ? ["queued", "posting"] : ["sent", "failed", "canceled"];
  const { rows, isLoading, isFetching, refetch } = useRows(statuses);
  const [cancelTweet, { isLoading: canceling }] = useTwitterCancelTweetMutation();

  const handleCancel = async (id: string) => {
    try {
      await cancelTweet(id).unwrap();
      toast.success(t("log.cancelDone"));
      refetch();
    } catch {
      toast.error(t("log.cancelFailed"));
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <CardTitle>
          {scope === "queue" ? t("log.queueTitle") : t("log.historyTitle")} ({rows.length})
        </CardTitle>
        <Button variant="outline" size="sm" onClick={refetch} disabled={isFetching}>
          <RefreshCw className="mr-2 h-4 w-4" />
          {t("log.refresh")}
        </Button>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <p className="py-6 text-muted-foreground text-sm">{t("log.loading")}</p>
        ) : rows.length === 0 ? (
          <p className="py-6 text-muted-foreground text-sm">
            {scope === "queue" ? t("log.queueEmpty") : t("log.historyEmpty")}
          </p>
        ) : (
          <div className="space-y-3">
            {rows.map((row) => (
              <TwitterTweetCard
                key={row.id}
                item={row}
                onCancel={(id) => void handleCancel(id)}
                canceling={canceling}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
