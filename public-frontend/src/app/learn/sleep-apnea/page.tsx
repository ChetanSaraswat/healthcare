import ConditionDetailPage from '../[slug]/page';

// Direct static page for /learn/sleep-apnea (Requirement 4)
export default function SleepApneaLearnPage() {
  return <ConditionDetailPage params={Promise.resolve({ slug: 'sleep-apnea' })} />;
}
