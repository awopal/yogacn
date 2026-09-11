import Link from "next/link";
import * as stylex from "@stylexjs/stylex";
import type { ClassPlan } from "../../../lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PencilLineIcon } from "@/components/icons";
import { colors } from "@/styles/tokens.stylex";
import { dashboardStyles } from "@/styles/dashboard.stylex";
import { pageStyles } from "@/styles/page.stylex";
import { typographyStyles } from "@/styles/typography.stylex";
import { levelLabel, statusLabel } from "../../../lib/utils";

export function RecentlyTaughtSection({ plans }: { plans: ClassPlan[] }) {
  return (
    <section>
      <div {...stylex.props(pageStyles.sectionHead)}>
        <h2 {...stylex.props(typographyStyles.h2)}>Recently taught</h2>
      </div>
      <div {...stylex.props(dashboardStyles.planList)}>
        {plans.slice(0, 2).map((plan) => (
          <article key={plan.id} {...stylex.props(dashboardStyles.planCard)}>
            <div {...stylex.props(dashboardStyles.planTop)}>
              <Badge variant={plan.status}>{statusLabel[plan.status]}</Badge>
              <div {...stylex.props(dashboardStyles.taughtMeta)}>
                <span {...stylex.props(typographyStyles.muted)}>
                  Taught {plan.taughtCount} times
                </span>
                <br />
                <span
                  {...stylex.props(
                    typographyStyles.muted,
                    typographyStyles.caption,
                  )}
                >
                  last at{" "}
                  {new Date(plan.lastTaughtAt).toLocaleDateString("en-US")}
                </span>
              </div>
            </div>
            <h3 {...stylex.props(typographyStyles.h2)}>{plan.title}</h3>
            <p {...stylex.props(typographyStyles.body)}>{plan.intention}</p>
            <div {...stylex.props(dashboardStyles.meta)}>
              <span>{plan.plannedDurationMinutes} min</span>
              <span>•</span>
              <span>{levelLabel[plan.level]}</span>
              <span>•</span>
              <span>{plan.peakPose || "—"}</span>
            </div>
            {plan.latestAdjustment && (
              <div {...stylex.props(dashboardStyles.adjustment)}>
                <strong {...stylex.props(dashboardStyles.adjustmentTitle)}>
                  Adjust next time
                </strong>
                <span>{plan.latestAdjustment}</span>
              </div>
            )}
            <div {...stylex.props(dashboardStyles.actions)}>
              <Button variant="outline" asChild>
                <Link
                  aria-label={`Continue editing ${plan.title}`}
                  href={`/classes/${plan.id}/edit`}
                  title="Continue editing"
                >
                  <PencilLineIcon size={24} color={colors.primary} />
                </Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href={`/classes/${plan.id}/teach`}>
                  Open Teaching Mode →
                </Link>
              </Button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
