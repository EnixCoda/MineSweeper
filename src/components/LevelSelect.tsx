import {
  Badge,
  Button,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  VStack
} from "@chakra-ui/react";
import * as React from "react";
import { Statistics } from "../hooks/useStatistics";
import {
  allLevelLabels,
  customLevel,
  Level,
  LevelSetting
} from "../models/Level";
import { IntInput } from "./NumberInput";
import { SimpleStatistics } from "./SimpleStatistics";

export const LevelSelect = React.memo(function LevelSelect({
  level,
  setLevel,
  customLevelSettings,
  setCustomLevelSettings,
  statistics,
}: {
  level: Level;
  setLevel: (level: Level) => void;
  customLevelSettings: LevelSetting;
  setCustomLevelSettings: (customLevelSettings: LevelSetting) => void;
  statistics: Statistics;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button onClick={() => onOpen()}>{level.toUpperCase()}</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Levels</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <RadioGroup value={level} onChange={(e) => setLevel(e as Level)}>
              <Table size="sm">
                <Thead>
                  <Tr>
                    <Th>Level</Th>
                    <Th>Stats</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {allLevelLabels.map(($level) => (
                    <Tr key={$level}>
                      <Td colSpan={$level === customLevel ? 2 : 1}>
                        <Radio value={$level}>
                          <Badge>{$level}</Badge>
                        </Radio>
                        {level === customLevel && level === $level && (
                          <VStack marginY="2" spacing="1">
                            <FormControl display="flex" alignItems="center">
                              <FormLabel flex="1" mb="0">
                                Width
                              </FormLabel>
                              <IntInput
                                maxWidth="160px"
                                min={1}
                                max={100}
                                value={customLevelSettings.width}
                                onChange={(width) =>
                                  setCustomLevelSettings({
                                    ...customLevelSettings,
                                    width,
                                  })
                                }
                              />
                            </FormControl>
                            <FormControl display="flex" alignItems="center">
                              <FormLabel flex="1" mb="0">
                                Height
                              </FormLabel>
                              <IntInput
                                maxWidth="160px"
                                min={1}
                                max={100}
                                value={customLevelSettings.height}
                                onChange={(height) =>
                                  setCustomLevelSettings({
                                    ...customLevelSettings,
                                    height,
                                  })
                                }
                              />
                            </FormControl>
                            <FormControl display="flex" alignItems="center">
                              <FormLabel flex="1" mb="0">
                                Mines
                              </FormLabel>
                              <IntInput
                                maxWidth="160px"
                                min={1}
                                max={
                                  customLevelSettings.width *
                                    customLevelSettings.height -
                                  1
                                }
                                value={customLevelSettings.mines}
                                onChange={(mines) =>
                                  setCustomLevelSettings({
                                    ...customLevelSettings,
                                    mines,
                                  })
                                }
                              />
                            </FormControl>
                          </VStack>
                        )}
                      </Td>
                      {$level !== customLevel && (
                        <Td>
                          <SimpleStatistics
                            level={$level}
                            statistics={statistics[$level]}
                          />
                        </Td>
                      )}
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </RadioGroup>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
});
