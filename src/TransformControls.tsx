import { useThree } from "@react-three/fiber";
import { FC, RefObject, ReactNode, useEffect, useMemo, useState } from "react";
import { Object3D } from "three";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";

type Props = {
    children?: (position: number[]) => ReactNode;
    object: RefObject<Object3D>;
};

const TransformControlsComponent: FC<Props> = ({ object, children }) => {
    const { camera, scene, gl } = useThree();
    const [isEditing, setIsEditing] = useState(false);
    const [position, setPosition] = useState([0,0,0]);

    const transformControls = useMemo(
        () => new TransformControls(camera, gl.domElement),
        [camera, gl.domElement]
    );

    /**
     * Attach the selected mesh on the scene to TransformControls
     * Whenever it is unmounted, it detach all attached meshes
     */
    useEffect(() => {
        if (object.current) {
            transformControls.attach(object.current);
        }

        return () => {
            transformControls.detach();
        };
    }, [scene, transformControls, object]);

    /**
     * Add TransformControls on the scene and remove it when it unmounted
     */
    useEffect(() => {
        scene.add(transformControls);

        return () => {
            scene.remove(transformControls);
        };
    }, [scene, transformControls]);

    /**
     * Set the current mode of TransformControls when it changes
     */
    useEffect(() => {
            transformControls.setMode("translate");
    }, [transformControls]);


    /**
     * Initialize events on TransformControls
     */
    useEffect(() => {
        const onDraggingChangedHandler = ({ value }: any) => {
            setIsEditing(value);
        };

        const onObjectChangeHandler = () => {
            if (object.current) {
                console.log(object.current, "object.current");
                setPosition([object.current.position.x, object.current.position.y, object.current.position.z])
            }
            
        };

        transformControls?.addEventListener("dragging-changed", onDraggingChangedHandler);
        transformControls?.addEventListener("objectChange", onObjectChangeHandler);

        return () => {
            transformControls?.removeEventListener("dragging-changed", onDraggingChangedHandler);
            transformControls?.removeEventListener("objectChange", onObjectChangeHandler);
        };
    }, [transformControls, setIsEditing, object]);

    return <>
        {children?.(position)}
    </>;
};

export default TransformControlsComponent;
