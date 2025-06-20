import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { format } from "date-fns";

import { getCommunityDetail } from "@community/services/communityApi";
import ManageBannerSection from "@community/components/manage/ManageBannerSection";
import ManageRulesSection from "@community/components/manage/ManageRulesSection";
import ManageMemberOverviewSection from "@community/components/manage/ManageMemberOverviewSection";
import ManageCategoriesSection from "@community/components/manage/ManageCategoriesSection";
import ManageDescriptionSection from "@community/components/manage/ManageDescriptionSection";
import MainLayout from "@/layout/MainLayout";
import { ROUTES } from "@/constants/apiRoutes/routes";

const LABELS = {
  title: "Manage Community",
  back: "Community",
  createdAtPrefix: "Created at:",
  errorLoad: "Failed to load community details or members. Please try again.",
  notFound: "No community found.",
  loading: "Loading community details...",
};

export default function CommunityManagePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [community, setCommunity] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRuleModal, setShowRuleModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const communityResponse = await getCommunityDetail(id);
        const communityData = communityResponse.data;

        if (communityData?.role !== "MANAGER") {
          navigate(ROUTES.COMMUNITY(id));
          return;
        }

        setCommunity(communityData);
        setShowRuleModal(true);
        setError(null);
      } catch (err) {
        console.error("Error fetching community data or members:", err);
        setError(LABELS.errorLoad);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleDescriptionUpdate = (newDescription) => {
    setCommunity((prev) => ({
      ...prev,
      description: newDescription,
    }));
  };

  if (loading) {
    return <div className="text-black dark:text-white p-8 text-center">{LABELS.loading}</div>;
  }

  if (error) {
    return <div className="text-red-600 dark:text-red-400 p-8 text-center">{error}</div>;
  }

  if (!community) {
    return <div className="text-red-600 dark:text-red-400 p-8 text-center">{LABELS.notFound}</div>;
  }

  return (
    <MainLayout>
      <div className="p-6 md:p-8 space-y-10 max-w-[1500px] w-full mx-auto border border-gray-300 dark:border-gray-800 rounded-lg bg-gray-100 dark:bg-gray-950 mt-6">
        {/* Back Arrow */}
        <div className="flex items-center mb-6">
          <ArrowLeft
            onClick={() => navigate(-1)}
            className="text-black dark:text-white cursor-pointer mr-4"
            size={24}
          />
          <h1 className="text-black dark:text-white text-2xl">{LABELS.back}</h1>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h1 className="text-black dark:text-white text-3xl font-bold">{LABELS.title}</h1>
          <span className="text-gray-500 dark:text-gray-400 text-sm">
            {LABELS.createdAtPrefix}{" "}
            {community.createdAt ? format(new Date(community.createdAt), "PPP") : "N/A"}
          </span>
        </div>

        {/* Content Sections */}
        <ManageBannerSection community={community} />

        <ManageDescriptionSection
          community={community}
          onUpdate={handleDescriptionUpdate}
        />

        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/2">
            <ManageRulesSection
              communityId={community.id}
              openOnLoad={showRuleModal}
              onCloseModal={() => setShowRuleModal(false)}
            />
          </div>

          <div className="md:w-1/2">
            <ManageCategoriesSection communityId={community.id} />
          </div>
        </div>

        <ManageMemberOverviewSection communityId={community.id} />
      </div>
    </MainLayout>
  );
}
