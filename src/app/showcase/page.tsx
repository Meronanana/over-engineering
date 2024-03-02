import Showcase from "@/containers/showcase";

interface Props {
  name: string;
}

const fetchData = async () => {
  return "Hello SSR!";
};

export async function getServerSideProps() {
  // 여기에서 데이터를 가져오는 로직을 작성합니다.
  const name = await fetchData(); // fetchData()는 실제 데이터를 가져오는 함수입니다.

  // 가져온 데이터를 props로 전달합니다.
  return {
    props: {
      name,
    },
  };
}

export default function App({ name }: Props) {
  return <Showcase name={name} />;
}
