import {
  Badge,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text
} from "@chakra-ui/react";
import * as React from "react";
import { LevelStatistics } from "../hooks/useStatistics";
import { Level } from "../models/Level";
import { formatTime } from "../utils";

export function SimpleStatistics({
  level,
  statistics,
  label,
}: {
  level: Level;
  statistics: LevelStatistics;
  label?: boolean;
}) {
  const record = statistics.records[0];
  return (
    <Stat>
      {label && (
        <StatLabel>
          <Badge>{level}</Badge>
        </StatLabel>
      )}
      <StatNumber>
        {statistics.wins} / {statistics.total}
        <Text fontSize="xs" as="span">
          (
          {statistics.total > 0
            ? ((statistics.wins / statistics.total) * 100).toFixed(1)
            : 0}
          %)
        </Text>
        {!label && <Text mt="1" fontSize="sm" fontWeight="normal">Best: {record ? formatTime(record) : "-"}</Text>}
      </StatNumber>
      {label && (
        <StatHelpText>Best: {record ? formatTime(record) : "-"}</StatHelpText>
      )}
    </Stat>
  );
}
