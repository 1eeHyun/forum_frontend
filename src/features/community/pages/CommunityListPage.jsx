import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "@/api/axios";
import { ChevronDown, Plus, Settings, Star, Users } from "lucide-react";
import { COMMUNITIES } from "@/constants/apiRoutes";
import MainLayout from "@/layout/MainLayout";
import CommunityList from "@community/components/common/CommunityList";



export default function CommunityListPage(){

    return(<MainLayout rightSidebar={null}>
        <div className="flex items-center gap-2 mb-2">
            <h2 className="text-3xl font-semibold dark:text-white" >Manage Communities</h2>
        </div>

        <div className="border-b border-gray-200 dark:border-gray-700 mb-4" />
        <CommunityList />
        
    </MainLayout>)

}