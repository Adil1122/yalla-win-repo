import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Group } from "three"
import { useGLTF, useScroll } from "@react-three/drei"

// useGLTF.preload("/assets/animations/modal.glb")

export default function Model() {
   const group = useRef<Group>(null)
   const { scene } = useGLTF("/assets/animations/modal.glb")
   // const { nodes, materials, animations, scene } = useGLTF(
   //    "/assets/animations/modal.glb"
   // )
   // const { actions, clips } = useAnimations(animations, scene)

   const scroll = useScroll()

   // useEffect(() => {
   //    console.log(actions)
   //    //@ts-ignore
   //    actions["Experiment"].play().paused = true
   // }, [])

   useFrame(() => {
      if (group.current) {
         const rotation = scroll.offset * Math.PI * 2
         group.current.rotation.y = rotation 
      }

      // //@ts-ignore
      // (actions["Experiment"].time =
      //   //@ts-ignore
      //   (actions["Experiment"].getClip().duration * scroll.offset) / 4)
   })

   return (
      <group ref={group}>
         <primitive object={scene} />
      </group>
   )
}
