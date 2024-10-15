import { useEffect, useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Group, MeshStandardMaterial, LoopOnce } from "three"
import { useAnimations, useGLTF, useScroll, useTexture } from "@react-three/drei"

export default function Model() {

   const group = useRef<Group>(null)
   const { nodes, materials, animations, scene } = useMemo(() => {
      return useGLTF("/assets/animations/6_fig_yalla.glb")
   }, [])

   const { actions } = useAnimations(animations, scene)
   const [texture] = useTexture(["/assets/animations/textures/red.jpeg"])
   
   const scroll = useScroll()
   let rotationAnim2 : any

   useEffect(() => {

      console.log(actions)
      console.log(materials)
   }, [])

   useEffect(() => {

      const material = materials[""] as MeshStandardMaterial | undefined

      if (material) {
         material.map = texture
         material.needsUpdate = true
      }

      const rotationAnim = actions["initaial rotation.001"]

      if (rotationAnim) {
         // Log when the animation starts
         rotationAnim.clampWhenFinished = true
         rotationAnim.setLoop(LoopOnce, 1)
         rotationAnim.reset().play()

         console.log("Animation 'initaial rotation.001' started")
      }

      return () => {
         
         if (rotationAnim) {
            rotationAnim.stop()
         }

         if (rotationAnim2) {
            rotationAnim2.stop()
         }
      }
   }, [actions, texture, materials])

   useFrame(() => {
      
      const rotationAnim = actions["initaial rotation.001"]
      if (rotationAnim) {
         // Check if the animation is near the end of its duration
         if (rotationAnim.getClip().duration - rotationAnim.time < 0.01) {
            console.log("Animation 'initaial rotation.001' ended")
            rotationAnim.reset().stop()

            rotationAnim2 = actions["ball.2_roll_out"]

            if (rotationAnim2) {
               
               rotationAnim2.clampWhenFinished = true
               rotationAnim2.setLoop(LoopOnce, 1)
               rotationAnim2.reset().play()

               console.log("Animation 'ball.2_roll_out' started")
            }
         }
      }
   })

   return (
      <group ref={group} position={[0, -5, 0]}>
         <primitive object={scene} />
      </group>
   )
}
