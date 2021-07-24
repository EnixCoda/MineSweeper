import {
  Button,
  Checkbox,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Switch,
  useUpdateEffect
} from "@chakra-ui/react";
import * as React from "react";
import { useAutoPlay } from "../hooks/useAutoPlay";
import { useGame } from "../hooks/useGame";
import { useGameTimerControl } from "../hooks/useGameTimerControl";
import { useHistory } from "../hooks/useHistory";
import { useSolutions } from "../hooks/useSolutions";
import { useStatistics } from "../hooks/useStatistics";
import { useStorage } from "../hooks/useStorage";
import { useTimer } from "../hooks/useTimer";
import { useToggleAutoPlay } from "../hooks/useToggleAutoPlay";
import { useUpdate } from "../hooks/useUpdate";
import { customLevel, Level, levels } from "../models/Level";
import { Cells } from "./Cells";
import { LevelSelect } from "./LevelSelect";
import { Solutions } from "./Solutions";
import { StatusBar } from "./StatusBar";
import { fullHeight, VH } from "./VH";

const enableTimeTravel = false;
const showSolutions = false;
const showAutoPlay = false;

export function App() {
  const update = useUpdate();
  const timer = useTimer();
  const [level, setLevel] = useStorage<Level>("level", "easy");
  const [customLevelSettings, setCustomLevelSettings] = useStorage(
    "custom",
    levels.get(customLevel)!
  );
  const [game, startGame] = useGame(update, levels.get(level)!);
  useUpdateEffect(() => {
    if (game.state === "idle") startGame(levels.get(level)!);
  }, [level]);
  useGameTimerControl(game, timer);

  const solutions = useSolutions(game);
  const [autoPlay, setAutoPlay, applySolutions] = useAutoPlay(game, solutions);
  const incAutoPlayCount = useToggleAutoPlay(game, autoPlay, setAutoPlay);
  const [showHint, setShowHint] = React.useState(false);

  const visibleSolutions = React.useMemo(
    () => (autoPlay || showHint ? solutions : []),
    [autoPlay, showHint, solutions]
  );

  const statistics = useStatistics(game, level, timer.value, autoPlay);

  const [history, goBack] = useHistory(game.grid);

  const [flag, setFlag] = React.useState(false);
  return (
    <VH>
      <div className="viewport" style={{ height: fullHeight }}>
        <Container width="640px" maxWidth="100%" padding="0">
          <StatusBar time={timer.value} game={game} />
          <Flex
            justifyContent="space-between"
            alignItems="center"
            paddingX="2"
            paddingY="1"
          >
            <LevelSelect
              level={level}
              setLevel={setLevel}
              customLevelSettings={customLevelSettings}
              setCustomLevelSettings={setCustomLevelSettings}
              statistics={statistics}
            />

            <Button
              onClick={() =>
                startGame(
                  level === customLevel
                    ? customLevelSettings
                    : levels.get(level)!
                )
              }
            >
              New Game
            </Button>
          </Flex>
        </Container>

        <div>
          {enableTimeTravel && (
            <button
              disabled={game.state !== "playing" || history.length < 2}
              onClick={() => {
                goBack();
                const prevState = history[history.length - 2];
                if (prevState) game.setGrid(prevState);
              }}
            >
              Cancel
            </button>
          )}
        </div>
        <Cells
          game={game}
          defaultAction={flag ? "flag" : "reveal"}
          solutions={visibleSolutions}
        />
        <Flex paddingY="4" justifyContent="space-evenly" alignItems="center">
          <FormControl width="auto" display="inline-flex" alignItems="center">
            <FormLabel mb="0" mr="2">
              Dig
            </FormLabel>
            <Switch
              name="use-flag"
              checked={flag}
              onChange={(e) => setFlag(e.target.checked)}
            />
            <FormLabel mb="0" ml="2">
              Flag
            </FormLabel>
          </FormControl>

          <Flex flexDirection="column">
            {showAutoPlay && (
              <Checkbox
                name="auto-play"
                checked={autoPlay}
                onChange={(e) => setAutoPlay(e.target.checked)}
              >
                Auto play
              </Checkbox>
            )}

            <Checkbox
              name="show-hint"
              checked={showHint}
              onChange={(e) => {
                incAutoPlayCount();
                setShowHint(e.target.checked);
              }}
            >
              Show Hint
            </Checkbox>
          </Flex>
        </Flex>
        {showSolutions && (
          <Solutions solutions={solutions} apply={applySolutions} />
        )}
      </div>
    </VH>
  );
}
