import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  BarChart3,
  CalendarDays,
  Camera,
  CheckCircle2,
  GalleryHorizontal,
  HeartHandshake,
  LayoutDashboard,
  MessageCircleHeart,
  Sparkles,
  Trophy,
  Users,
  Vote,
  XCircle,
} from "lucide-react";

import { useAdminProfile } from "../../hooks/useAdmin";
import { useEvents } from "../../hooks/useEvents";
import { useAdminWishes } from "../../hooks/useWishes";
import { useGuestResponses } from "../../hooks/useGuestResponses";
import { useAdminGallery } from "../../hooks/useGallery";
import { useAdminCircleStories } from "../../hooks/useCircleOfLove";
import { useAdminPolls } from "../../hooks/usePolls";
import { PageHero, StatCard, AdminCard, LoadingPanel } from "../../components/admin/AdminUI";

const colors = ["#2563eb", "#7c3aed", "#0891b2", "#f59e0b", "#e11d48", "#10b981", "#db2777"];

const ChartTitle = ({ icon: Icon, title, sub }) => (
  <div className="mb-5 flex items-center justify-between gap-3">
    <div className="flex min-w-0 items-center gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white">
        <Icon size={19} />
      </div>
      <div className="min-w-0">
        <h3 className="truncate text-base font-black text-slate-950">{title}</h3>
        {sub && <p className="text-xs font-semibold text-slate-500">{sub}</p>}
      </div>
    </div>
  </div>
);

const EmptyChart = () => (
  <div className="grid h-72 place-items-center rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 text-center text-sm font-bold text-slate-500">
    Data will appear after guests interact with the website.
  </div>
);

const MiniMetric = ({ label, value, sub, className = "" }) => (
  <div className={`rounded-[1.35rem] border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/60 ${className}`}>
    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">{label}</p>
    <p className="mt-2 text-3xl font-black tracking-tight text-slate-950">{value ?? 0}</p>
    {sub && <p className="mt-1 text-xs font-bold text-slate-500">{sub}</p>}
  </div>
);

const AdminDashboard = () => {
  const { data: profileData } = useAdminProfile();
  const { data: eventsData, isLoading: eventsLoading } = useEvents();
  const { data: wishesData, isLoading: wishesLoading } = useAdminWishes();
  const { data: guestResponsesData, isLoading: responsesLoading } = useGuestResponses();
  const { data: galleryData, isLoading: galleryLoading } = useAdminGallery({ limit: 100 });
  const { data: circleData, isLoading: circleLoading } = useAdminCircleStories();
  const { data: pollsData, isLoading: pollsLoading } = useAdminPolls();

  if (
    eventsLoading ||
    wishesLoading ||
    responsesLoading ||
    galleryLoading ||
    circleLoading ||
    pollsLoading
  ) {
    return <LoadingPanel message="Building admin dashboard..." />;
  }

  const events = eventsData?.data || [];
  const wishes = wishesData?.data || [];
  const guestResponses = guestResponsesData?.data || [];
  const gallery = galleryData?.data || [];
  const circleStories = circleData?.data || [];
  const polls = pollsData?.data || [];

  const circleStats = circleData?.stats || {};
  const pollStats = pollsData?.stats || {};

  const approvedWishes = wishes.filter((wish) => wish.isApproved).length;
  const pendingWishes = wishes.length - approvedWishes;

  const attending = guestResponses.filter((guest) => guest.attending).length;
  const notAttending = guestResponses.filter((guest) => !guest.attending).length;
  const totalGuests = guestResponses.reduce(
    (total, guest) => total + (guest.attending ? Number(guest.guestCount || 0) : 0),
    0
  );

  const photos = gallery.filter((item) => item.type === "photo").length;
  const videos = gallery.filter((item) => item.type === "video").length;
  const featuredMedia = gallery.filter((item) => item.isFeatured).length;
  const visibleMedia = gallery.filter((item) => item.isVisible).length;

  const engagementGuests = guestResponses.filter((guest) => guest.event === "Engagement").length;
  const marriageGuests = guestResponses.filter((guest) => guest.event === "Marriage").length;
  const bothGuests = guestResponses.filter((guest) => guest.event === "Both").length;

  const approvedCircleStories =
    circleStats.approved ?? circleStories.filter((story) => story.isApproved).length;
  const pendingCircleStories =
    circleStats.pending ?? circleStories.filter((story) => !story.isApproved).length;
  const featuredCircleStories =
    circleStats.featured ?? circleStories.filter((story) => story.isFeatured).length;

  const groomStories =
    circleStats.groom ?? circleStories.filter((story) => story.side === "groom").length;
  const brideStories =
    circleStats.bride ?? circleStories.filter((story) => story.side === "bride").length;
  const bothSideStories =
    circleStats.both ?? circleStories.filter((story) => story.side === "both").length;

  const totalPolls = pollStats.totalPolls ?? polls.length;
  const approvedPolls =
    pollStats.approved ?? polls.filter((poll) => poll.status === "approved").length;
  const pendingPolls =
    pollStats.pending ?? polls.filter((poll) => poll.status === "pending").length;
  const activePolls =
    pollStats.active ?? polls.filter((poll) => poll.isActive).length;
  const guestSuggestedPolls =
    pollStats.guestSuggested ?? polls.filter((poll) => poll.createdBy === "guest").length;
  const totalPollVotes =
    pollStats.totalVotes ?? polls.reduce((sum, poll) => sum + Number(poll.totalVotes || 0), 0);
  const kevinVotes =
    pollStats.kevinVotes ?? polls.reduce((sum, poll) => sum + Number(poll.kevinVotes || 0), 0);
  const jenithVotes =
    pollStats.jenithVotes ?? polls.reduce((sum, poll) => sum + Number(poll.jenithVotes || 0), 0);

  const kevinPercentage = totalPollVotes ? Math.round((kevinVotes / totalPollVotes) * 100) : 0;
  const jenithPercentage = totalPollVotes ? Math.round((jenithVotes / totalPollVotes) * 100) : 0;

  const totalPendingReview = pendingWishes + pendingCircleStories + pendingPolls;
  const totalPublicInteractions =
    wishes.length + guestResponses.length + circleStories.length + totalPollVotes;

  const kpis = [
    {
      label: "Events",
      value: events.length,
      icon: CalendarDays,
      tone: "sky",
      sub: `${events.filter((event) => event.isActive).length} active`,
    },
    {
      label: "Media",
      value: gallery.length,
      icon: GalleryHorizontal,
      tone: "violet",
      sub: `${featuredMedia} featured`,
    },
    {
      label: "Wishes",
      value: wishes.length,
      icon: MessageCircleHeart,
      tone: "amber",
      sub: `${pendingWishes} pending`,
    },
    {
      label: "Responses",
      value: guestResponses.length,
      icon: Users,
      tone: "emerald",
      sub: `${totalGuests} guests expected`,
    },
    {
      label: "Circle Stories",
      value: circleStories.length,
      icon: HeartHandshake,
      tone: "rose",
      sub: `${pendingCircleStories} pending`,
    },
    {
      label: "Couple Polls",
      value: totalPolls,
      icon: Vote,
      tone: "sky",
      sub: `${totalPollVotes} votes • ${guestSuggestedPolls} guest ideas`,
    },
    {
      label: "Review Queue",
      value: totalPendingReview,
      icon: CheckCircle2,
      tone: "slate",
      sub: "needs admin action",
    },
  ];

  const attendanceData = [
    { name: "Attending", value: attending },
    { name: "Not attending", value: notAttending },
  ];

  const mediaData = [
    { name: "Photos", value: photos },
    { name: "Videos", value: videos },
    { name: "Featured", value: featuredMedia },
  ];

  const eventInterestData = [
    { name: "Engagement", value: engagementGuests },
    { name: "Marriage", value: marriageGuests },
    { name: "Both", value: bothGuests },
  ];

  const activityData = [
    { name: "Events", value: events.length },
    { name: "Media", value: gallery.length },
    { name: "Wishes", value: wishes.length },
    { name: "RSVP", value: guestResponses.length },
    { name: "Circle", value: circleStories.length },
    { name: "Polls", value: totalPolls },
  ];

  const reviewQueueData = [
    { name: "Wishes", value: pendingWishes },
    { name: "Circle", value: pendingCircleStories },
    { name: "Polls", value: pendingPolls },
  ];

  const circleSideData = [
    { name: "Groom Side", value: groomStories },
    { name: "Bride Side", value: brideStories },
    { name: "Both Sides", value: bothSideStories },
  ];

  const pollVoteData = [
    { name: "Kevin", value: kevinVotes, percentage: kevinPercentage },
    { name: "Jenith", value: jenithVotes, percentage: jenithPercentage },
  ].sort((a, b) => b.value - a.value);

  const publicInteractionData = [
    { name: "Wishes", value: wishes.length },
    { name: "Attendance", value: guestResponses.length },
    { name: "Circle Stories", value: circleStories.length },
    { name: "Poll Votes", value: totalPollVotes },
  ];

  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="Live Admin Intelligence"
        title={`Welcome back, ${profileData?.data?.name || "Admin"}`}
        description="A cleaner command center to track events, media, wishes, attendance, Circle of Love stories, Couple Polls and public guest interactions in one premium dashboard."
        icon={LayoutDashboard}
        gradient="slate"
      >
        <div className="grid min-w-[260px] grid-cols-2 gap-3 rounded-[1.5rem] border border-white/15 bg-white/10 p-4 backdrop-blur-xl">
          <div>
            <p className="text-xs font-bold text-white/65">Public interactions</p>
            <p className="mt-1 text-3xl font-black">{totalPublicInteractions}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-white/65">Pending review</p>
            <p className="mt-1 text-3xl font-black">{totalPendingReview}</p>
          </div>
        </div>
      </PageHero>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-7">
        {kpis.map((item) => (
          <StatCard key={item.label} {...item} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        <MiniMetric
          label="Circle Approved"
          value={approvedCircleStories}
          sub={`${featuredCircleStories} featured stories`}
        />
        <MiniMetric
          label="Poll Votes"
          value={totalPollVotes}
          sub={`${activePolls} active polls`}
        />
        <MiniMetric
          label="Kevin Poll Share"
          value={`${kevinPercentage}%`}
          sub={`${kevinVotes} votes`}
        />
        <MiniMetric
          label="Jenith Poll Share"
          value={`${jenithPercentage}%`}
          sub={`${jenithVotes} votes`}
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
        <AdminCard>
          <ChartTitle
            icon={BarChart3}
            title="Workspace Distribution"
            sub="Main data collections across the wedding admin system"
          />
          {activityData.some((item) => item.value > 0) ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} />
                  <Tooltip cursor={{ fill: "#f8fafc" }} />
                  <Bar dataKey="value" radius={[14, 14, 0, 0]}>
                    {activityData.map((_, index) => (
                      <Cell key={index} fill={colors[index % colors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyChart />
          )}
        </AdminCard>

        <AdminCard>
          <ChartTitle icon={Users} title="Attendance Split" sub="RSVP response status" />
          {guestResponses.length ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={attendanceData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={70}
                    outerRadius={105}
                    paddingAngle={4}
                  >
                    {attendanceData.map((_, index) => (
                      <Cell key={index} fill={index === 0 ? "#059669" : "#e11d48"} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyChart />
          )}
        </AdminCard>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
        <AdminCard>
          <ChartTitle
            icon={HeartHandshake}
            title="Circle of Love Sides"
            sub="Groom side, bride side and both-side stories"
          />
          {circleStories.length ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={circleSideData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={62}
                    outerRadius={104}
                    paddingAngle={5}
                  >
                    {circleSideData.map((_, index) => (
                      <Cell key={index} fill={["#2563eb", "#db2777", "#7c3aed"][index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyChart />
          )}
        </AdminCard>

        <AdminCard>
          <ChartTitle
            icon={Vote}
            title="Couple Poll Result"
            sub="Higher vote percentage appears first"
          />
          {totalPollVotes > 0 ? (
            <div className="space-y-4">
              {pollVoteData.map((item, index) => (
                <div
                  key={item.name}
                  className={`rounded-[1.5rem] border p-4 ${
                    index === 0
                      ? "border-indigo-200 bg-indigo-50"
                      : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        {index === 0 && <Trophy className="h-4 w-4 text-amber-500" />}
                        <p className="text-lg font-black text-slate-950">{item.name}</p>
                      </div>
                      <p className="text-xs font-bold text-slate-500">{item.value} votes</p>
                    </div>
                    <p className="text-3xl font-black text-slate-950">{item.percentage}%</p>
                  </div>

                  <div className="mt-4 h-3 overflow-hidden rounded-full bg-white">
                    <div
                      className={`h-full rounded-full ${
                        item.name === "Kevin"
                          ? "bg-gradient-to-r from-blue-500 to-indigo-600"
                          : "bg-gradient-to-r from-pink-500 to-fuchsia-600"
                      }`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyChart />
          )}
        </AdminCard>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <AdminCard>
          <ChartTitle icon={Camera} title="Media Mix" sub="Photos, videos and featured memories" />
          {gallery.length ? (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mediaData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} />
                  <Tooltip />
                  <Area dataKey="value" stroke="#7c3aed" fill="#ede9fe" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyChart />
          )}
        </AdminCard>

        <AdminCard>
          <ChartTitle icon={HeartHandshake} title="Guest Event Choice" sub="Which event guests selected" />
          {guestResponses.length ? (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={eventInterestData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                  <XAxis type="number" allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} fontSize={12} width={90} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[0, 14, 14, 0]} fill="#0891b2" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyChart />
          )}
        </AdminCard>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
        <AdminCard>
          <ChartTitle
            icon={Sparkles}
            title="Public Interaction Strength"
            sub="Where guests are interacting most"
          />
          {publicInteractionData.some((item) => item.value > 0) ? (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={publicInteractionData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} />
                  <Tooltip cursor={{ fill: "#f8fafc" }} />
                  <Bar dataKey="value" radius={[14, 14, 0, 0]}>
                    {publicInteractionData.map((_, index) => (
                      <Cell key={index} fill={["#e11d48", "#059669", "#7c3aed", "#2563eb"][index]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyChart />
          )}
        </AdminCard>

        <AdminCard>
          <ChartTitle
            icon={CheckCircle2}
            title="Pending Review Queue"
            sub="Items waiting for admin moderation"
          />
          {reviewQueueData.some((item) => item.value > 0) ? (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={reviewQueueData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                  <XAxis type="number" allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} fontSize={12} width={80} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[0, 14, 14, 0]}>
                    {reviewQueueData.map((_, index) => (
                      <Cell key={index} fill={["#f59e0b", "#db2777", "#2563eb"][index]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyChart />
          )}
        </AdminCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <AdminCard className="bg-slate-950 text-white">
          <Sparkles className="h-7 w-7 text-cyan-300" />
          <h3 className="mt-4 text-xl font-black">Admin focus</h3>
          <p className="mt-2 text-sm font-medium leading-6 text-slate-300">
            {totalPendingReview > 0
              ? `${totalPendingReview} public submissions are waiting for review before they appear on the website.`
              : "All moderation queues are clean. Public interaction pages are ready for guests."}
          </p>
        </AdminCard>

        <AdminCard>
          <CheckCircle2 className="h-7 w-7 text-emerald-600" />
          <h3 className="mt-4 text-xl font-black text-slate-950">Published content</h3>
          <p className="mt-2 text-sm font-bold leading-6 text-slate-500">
            {approvedWishes} approved wishes, {visibleMedia} visible memories, {approvedCircleStories} Circle of Love stories and {approvedPolls} approved polls.
          </p>
        </AdminCard>

        <AdminCard>
          <XCircle className="h-7 w-7 text-rose-600" />
          <h3 className="mt-4 text-xl font-black text-slate-950">Needs review</h3>
          <p className="mt-2 text-sm font-bold leading-6 text-slate-500">
            {pendingWishes} wishes, {pendingCircleStories} Circle stories and {pendingPolls} guest poll questions need attention.
          </p>
        </AdminCard>
      </div>
    </div>
  );
};

export default AdminDashboard;