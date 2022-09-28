import { useEffect, useRef, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, TransformControls as T } from '@react-three/drei';
import TransformControls from "./TransformControls";
import { Debug,Physics, RigidBody, RigidBodyApi } from '@react-three/rapier';
import { Mesh, Object3D, Vector3 } from 'three';
import { isEditable } from '@testing-library/user-event/dist/utils';

function Plane() {
  return (
    <RigidBody>
      <mesh position={[0,-5,0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[100, 100]} />
      </mesh>
    </RigidBody>
  )
}

function Cube() {
  return (
    <RigidBody position={[0,2,0]}>
        <mesh  >
          <boxGeometry />
        </mesh>
    </RigidBody>
  )
}

function App() {
  const ref = useRef<Mesh>(null);
  const colliderRef = useRef<RigidBodyApi>(null);
  const [rbPos, setRbPos] = useState<any>([0,0,0]);

  useEffect(() => {
    if (colliderRef.current) {
      console.log(colliderRef.current, "colliderRef.current");
      console.log(rbPos, "rbPos");
      
      colliderRef.current.setTranslation(new Vector3(rbPos[0], rbPos[1], rbPos[2]));
      // colliderRef.current.setTranslation(unSerializeVector3(position));
    }    
  }, [rbPos])

  return (
    <div style={{ height: "100vh" }}>
      <Canvas>
        <OrbitControls enableRotate={false} />
        <Physics>
          <Debug />
          <TransformControls object={ref}>
            {(position) => {
              setRbPos(position);

              return (
                <RigidBody ref={colliderRef} position={position as any}>
                    <mesh ref={ref} >
                      <boxGeometry />
                      <meshStandardMaterial color="yellow" />
                    </mesh>
                </RigidBody>
              )
            }}
          </TransformControls>
          <Plane />
        </Physics>
      </Canvas>
    </div>
  );
}

export default App;
