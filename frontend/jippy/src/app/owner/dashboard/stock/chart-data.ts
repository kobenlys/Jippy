import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    labels: ["January", "February", "March", "April", "May"],
    data: [10, 20, 15, 30, 25],
  });
}
