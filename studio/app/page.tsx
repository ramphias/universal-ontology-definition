import { DashboardClient, DashboardStat } from "@/components/DashboardClient";
import { getOntologyLayer } from "@/lib/github";
import { getAvailableL2Extensions, getAvailableL3Enterprises } from "@/lib/actions";

// ISR: revalidate cache every 10 minutes to sync with GitHub while keeping responses ultra-fast
export const revalidate = 600; 

export default async function Home() {
  
  let l1ClassesCount = 0;
  let l2Count = 0;
  let l3Count = 0;
  let githubActive = false;

  try {
     // Run fetches concurrently to optimize server response
     const [l1Data, l2Exts, l3Ents] = await Promise.all([
        getOntologyLayer("L1"),
        getAvailableL2Extensions(),
        getAvailableL3Enterprises()
     ]);

     if (l1Data && Array.isArray(l1Data.classes)) {
         l1ClassesCount = l1Data.classes.length;
     }
     
     if (Array.isArray(l2Exts)) l2Count = l2Exts.length;
     if (Array.isArray(l3Ents)) l3Count = l3Ents.length;
     
     githubActive = true;
  } catch (error) {
     console.error("Failed to fetch real stats for dashboard:", error);
     githubActive = false;
  }

  const realStats: DashboardStat[] = [
    { 
       label: "System Status", 
       value: githubActive ? "Online" : "Offline", 
       detail: githubActive ? "Connected to Repository" : "API Limit Exceeded",
       statusColor: githubActive ? "bg-deloitte-green" : "bg-red-500"
    },
    { 
       label: "L1 Core Classes", 
       value: `${l1ClassesCount}`, 
       detail: "Baseline abstract nodes" 
    },
    { 
       label: "L2 Extensions", 
       value: `${l2Count}`, 
       detail: "Industry blueprint domains" 
    },
    { 
       label: "L3 Enterprises", 
       value: `${l3Count}`, 
       detail: "Private application instances" 
    },
  ];

  return <DashboardClient stats={realStats} />;
}
