"use client";

import { useAdminT } from "@/app/(main)/admin/_components/common/use-admin-t";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import BlogListPanel from "./_components/blog-list-panel";

export default function BlogPage() {
  const t = useAdminT("admin.blog");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("header.title")}</CardTitle>
          <CardDescription>{t("header.description")}</CardDescription>
        </CardHeader>
      </Card>

      <BlogListPanel />
    </div>
  );
}
