import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr
} from "@chakra-ui/react";
import * as React from "react";
import { Statistics } from "../hooks/useStatistics";
import { Level } from "../models/Level";
import { formatTime } from "../utils";

export function Statistics({ statistics }: { statistics: Statistics }) {
  const [isModalOpen, setModalOpen] = React.useState(false);
  return (
    <>
      <Button aria-label="statistics" onClick={() => setModalOpen(true)}>
        Statistics
      </Button>
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Statistics</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Level</Th>
                  <Th>Wins/Total</Th>
                  <Th>1st</Th>
                  <Th>2nd</Th>
                  <Th>3rd</Th>
                </Tr>
              </Thead>
              <Tbody>
                {(["easy", "medium", "hard"] as Level[]).map((level) => (
                  <Tr key={level}>
                    <Td>{level}</Td>
                    <Td isNumeric>
                      {statistics[level].wins}/{statistics[level].total}
                    </Td>
                    {statistics[level].records.map((record, i) => (
                      <Td isNumeric key={i}>
                        {record && formatTime(record, 5)}
                      </Td>
                    ))}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
