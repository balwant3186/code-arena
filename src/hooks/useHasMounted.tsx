import { useEffect, useState } from "react";

const useHasMounted = () => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return useHasMounted;
};

export default useHasMounted;
