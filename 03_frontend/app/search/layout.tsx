import { BottomNavigation } from '@/components/layout/BottomNavigation'

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative">
      {children}
      <BottomNavigation />
    </div>
  )
}