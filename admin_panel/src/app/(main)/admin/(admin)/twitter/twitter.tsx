// =============================================================
// FILE: src/app/(main)/admin/(admin)/twitter/twitter.tsx
// Admin Twitter/X Page (Settings + Send + Log)
// =============================================================

"use client";

import { Settings, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { useAdminT } from "@/app/(main)/admin/_components/common/use-admin-t";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTwitterStatusQuery, useTwitterVerifyMutation } from "@/integrations/hooks";
import { getErrorMessage } from "@/integrations/shared";

import TwitterLogPanel from "./_components/twitter-log-panel";
import TwitterSendPanel from "./_components/twitter-send-panel";
import TwitterTemplatePanel from "./_components/twitter-template-panel";

export default function TwitterAdminPage() {
  const t = useAdminT("admin.twitter");
  const { data: status, refetch: refetchStatus } = useTwitterStatusQuery();
  const [twitterVerify, { isLoading: verifying }] = useTwitterVerifyMutation();

  const handleVerify = async () => {
    try {
      const res = await twitterVerify().unwrap();
      if (res.ok && res.account) {
        toast.success(`${t("header.verified")}: @${res.account.username}`);
      } else {
        toast.error(t("header.verifyFailed"));
      }
    } catch (err) {
      toast.error(`${t("header.verifyFailed")}: ${getErrorMessage(err)}`);
    } finally {
      void refetchStatus();
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div className="space-y-2">
            <CardTitle className="text-base">{t("header.title")}</CardTitle>
            <CardDescription>{t("header.description")}</CardDescription>
            <div className="flex gap-2">
              <Badge variant={status?.enabled ? "default" : "secondary"}>
                {status?.enabled ? t("header.statusEnabled") : t("header.statusDisabled")}
              </Badge>
              <Badge variant={status?.has_credentials ? "default" : "destructive"}>
                {status?.has_credentials ? t("header.credentialsOk") : t("header.credentialsMissing")}
              </Badge>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleVerify} disabled={verifying || !status?.has_credentials}>
            <ShieldCheck className="mr-2 h-4 w-4" />
            {verifying ? t("header.verifying") : t("header.verify")}
          </Button>
          <Button asChild variant="outline" size="sm">
            <a href="/admin/site-settings?tab=api">
              <Settings className="mr-2 h-4 w-4" />
              {t("header.apiSettings")}
            </a>
          </Button>
        </CardHeader>
      </Card>

      <Tabs defaultValue="templates" className="w-full">
        <TabsList>
          <TabsTrigger value="templates">{t("tabs.templates")}</TabsTrigger>
          <TabsTrigger value="send">{t("tabs.send")}</TabsTrigger>
          <TabsTrigger value="queue">{t("tabs.queue")}</TabsTrigger>
          <TabsTrigger value="history">{t("tabs.history")}</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          <TwitterTemplatePanel />
        </TabsContent>

        <TabsContent value="send" className="space-y-4">
          <TwitterSendPanel />
        </TabsContent>

        <TabsContent value="queue" className="space-y-4">
          <TwitterLogPanel scope="queue" />
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <TwitterLogPanel scope="history" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
