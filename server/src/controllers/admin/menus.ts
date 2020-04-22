import { Request, Response } from "express";

import { wrapAsync } from "../../helpers/wrap-async";

/**
 * Fetch menu list
 *
 * @Method GET
 * @URL /api/admin/menus/fetch
 *
 */
export const fetch = wrapAsync(
  async (_req: Request, res: Response): Promise<void> => {
    res.json({
      success: true,
      data: [
        {
          path: "/dashboard",
          name: "dashboard",
          children: [
            {
              path: "/dashboard/analysis",
              name: "analysis",
            },
            {
              path: "/dashboard/monitor",
              name: "monitor",
            },
            {
              path: "/dashboard/workplace",
              name: "workplace",
            },
          ],
        },
        // ....
      ],
    });
  }
);
