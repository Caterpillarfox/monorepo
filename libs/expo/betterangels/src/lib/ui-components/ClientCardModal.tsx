import { FilePlusIcon, UploadIcon } from '@monorepo/expo/shared/icons';
import { useRouter } from 'expo-router';
import { ClientProfileType } from '../apollo';
import { useCreateNoteMutation } from '../screens/Home/__generated__/ActiveClients.generated';
import MainModal from './MainModal';

interface IMainPlusModalProps {
  closeModal: () => void;
  isModalVisible: boolean;
  client: ClientProfileType | undefined;
}

export default function ClientCardModal(props: IMainPlusModalProps) {
  const { isModalVisible, closeModal, client } = props;
  const [createNote] = useCreateNoteMutation();
  const router = useRouter();

  async function createNoteFunction(
    id: string,
    firstName: string | undefined | null
  ) {
    try {
      const { data } = await createNote({
        variables: {
          data: {
            title: `Session with ${firstName || 'Client'}`,
            client: id,
          },
        },
      });
      if (data?.createNote && 'id' in data.createNote) {
        router.navigate(`/add-note/${data?.createNote.id}`);
        closeModal();
      }
    } catch (err) {
      console.log(err);
    }
  }

  const ACTIONS = [
    {
      title: 'Add Interaction',
      Icon: FilePlusIcon,
      route: `/add-interaction/${client?.id}`,
      onPress: () => {
        if (client) {
          createNoteFunction(client.user.id, client.user.firstName);
        }
      },
    },
    {
      title: 'Upload Documents',
      Icon: UploadIcon,
      route: '/add-client',
    },
  ];
  return (
    <MainModal
      closeButton
      vertical
      actions={ACTIONS}
      isModalVisible={isModalVisible}
      closeModal={closeModal}
      opacity={0.5}
    />
  );
}