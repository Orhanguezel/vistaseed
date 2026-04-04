import JobApplicationDetailClient from "../_components/job-application-detail-client";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <JobApplicationDetailClient id={id} />;
}
