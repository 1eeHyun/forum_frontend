import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCommunityDetail, getCommunityMembers } from "@community/services/communityApi";
import { ArrowLeft } from "lucide-react";  // ArrowLeft 아이콘 임포트
import ManageBannerSection from "@community/components/manage/ManageBannerSection";
import ManageRulesSection from "@community/components/manage/ManageRulesSection";
import ManageMemberOverviewSection from "@community/components/manage/ManageMemberOverviewSection";
import ManageCategoriesSection from "@community/components/manage/ManageCategoriesSection";
import ManageDescriptionSection from "@community/components/manage/ManageDescriptionSection";

export default function CommunityManagePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [community, setCommunity] = useState(null);
  const [error, setError] = useState(null);
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [members, setMembers] = useState([]);

  const handleDescriptionUpdate = (newDescription) => {
    setCommunity((prev) => ({
      ...prev,
      description: newDescription,
    }));
  };

  useEffect(() => {
    // Fetch community details
    getCommunityDetail(id)
      .then((res) => {
        const data = res.data.data;
        console.log("Fetched community data:", data); // Check if role exists in community data
        setCommunity(data);
        setShowRuleModal(true);
      })
      .catch((err) => {
        console.error("Failed to fetch community details", err);
        setError("Failed to load community");
      });

    // Fetch community members
    getCommunityMembers(id)
      .then((res) => setMembers(res.data.data))
      .catch((err) => console.error("Failed to fetch members", err));
  }, [id]);

  if (error) {
    return <div className="text-red-500 p-8 text-center">{error}</div>;
  }

  if (!community) {
    return <div className="text-white p-8 text-center">Loading community details...</div>;
  }

  return (
    <div className="mt-10 p-8 space-y-10 max-w-5xl mx-auto border border-gray-800 rounded-lg bg-gray-950">
      {/* Back Button with Icon */}
      <button
        onClick={() => navigate(-1)} // Go back to the previous page
        className="text-blue-500 hover:underline mb-4 flex items-center gap-2"
      >
        <ArrowLeft size={20} className="text-white" /> {/* Back icon */}
        <span className="text-white">Community</span>
      </button>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-white text-3xl font-bold">Manage Community</h1>
        <span className="text-gray-400 text-sm">Created at: {new Date(community.createdAt).toLocaleDateString()}</span>
      </div>

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

      <ManageMemberOverviewSection
        memberCount={community.memberCount}
        users={members}
      />
    </div>
  );
}
