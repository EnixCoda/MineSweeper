import {
  Button,
  Checkbox,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Kbd,
  Switch,
  useUpdateEffect
} from "@chakra-ui/react";
import * as React from "react";
import { useAutoPlay } from "../hooks/useAutoPlay";
import { useGame } from "../hooks/useGame";
import { useGameTimerControl } from "../hooks/useGameTimerControl";
import { useHistory } from "../hooks/useHistory";
import { useKeyboardEvents } from "../hooks/useKeyboardHold";
import { useSolutions } from "../hooks/useSolutions";
import { useStatistics } from "../hooks/useStatistics";
import { useStorage } from "../hooks/useStorage";
import { useTimer } from "../hooks/useTimer";
import { useToggleAutoPlay } from "../hooks/useToggleAutoPlay";
import { useUpdate } from "../hooks/useUpdate";
import { customLevel, Level, levels } from "../models/Level";
import { Solution } from "../models/solver";
import { Cells } from "./Cells";
import { LevelSelect } from "./LevelSelect";
import { Solutions } from "./Solutions";
import { StatusBar } from "./StatusBar";
import { fullHeight, VH } from "./VH";

const searchParams = new URL(location.href).searchParams;
const enableTimeTravel = searchParams.get("time-travel") !== null;
const showSolutionsTable = searchParams.get("solutions") !== null;
const showAutoPlay = searchParams.get("autoplay") !== null;

export function App() {
  const update = useUpdate();
  const timer = useTimer();
  const [level, setLevel] = useStorage<Level>("level", "easy");
  const [customLevelSettings, setCustomLevelSettings] = useStorage(
    "custom",
    levels.get(customLevel)!
  );
  const getLevel = React.useCallback(
    (level: Level) =>
      level === customLevel ? customLevelSettings : levels.get(level)!,
    [customLevelSettings]
  );

  const [game, startGame] = useGame(update, getLevel(level));
  useUpdateEffect(() => {
    if (game.state === "idle") startGame(getLevel(level));
  }, [level, getLevel]);
  useGameTimerControl(game, timer);

  const [showHint, setShowHint] = React.useState(false);
  const [autoPlay, setAutoPlay] = React.useState(false);
  const shouldShowSolutions = showHint || autoPlay;
  const shouldGetSolutions = showSolutionsTable || shouldShowSolutions;
  const solutions = useSolutions(game, shouldGetSolutions);
  const visibleSolutions = React.useMemo(
    () => (shouldShowSolutions ? solutions : []),
    [shouldShowSolutions, solutions]
  );

  const applySolutions = React.useCallback(
    (solutions: Solution[]) => {
      if (solutions.length) {
        game.mutate(() =>
          solutions.forEach(([position, action]) =>
            game.onAction(position, action)
          )
        );
      }
    },
    [game]
  );
  useAutoPlay(autoPlay, applySolutions, solutions);
  const incAutoPlayCount = useToggleAutoPlay(game, autoPlay, setAutoPlay);

  const statistics = useStatistics(game, level, timer.value, autoPlay);

  const [history, goBack] = useHistory(game.grid);

  const [flag, setFlag] = React.useState(false);
  useKeyboardEvents(
    "n",
    React.useCallback(
      () => startGame(getLevel(level)),
      [startGame, getLevel, level]
    )
  );
  useKeyboardEvents(
    "q",
    React.useCallback(() => setFlag(true), []),
    React.useCallback(() => setFlag(false), [])
  );

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

            <Button onClick={() => startGame(getLevel(level))}>New Game</Button>
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
            <FormLabel mb="0" mr="2" ml="0">
              Dig
            </FormLabel>
            <Switch
              name="use-flag"
              isChecked={flag}
              onChange={(e) => setFlag(e.target.checked)}
            />
            <FormLabel mb="0" ml="2" mr="0">
              Flag <Kbd>F</Kbd>
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
        {showSolutionsTable && (
          <Solutions solutions={solutions} apply={applySolutions} />
        )}
      </div>
    </VH>
  );
}
