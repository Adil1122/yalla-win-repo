import { useEffect, useMemo, useRef, forwardRef, useImperativeHandle } from "react"
import { useFrame } from "@react-three/fiber"
import { Group, LoopOnce } from "three"
import { useAnimations, useGLTF } from "@react-three/drei"

const Modal = forwardRef((props, ref) => {
   const group = useRef<Group>(null)
   const { nodes, materials, animations, scene } = useGLTF("/assets/animations/6_fig_yalla_v3.glb")

   const { actions } = useAnimations(animations, scene)
   const rotationAnim = actions["wheel_roll_1"]
   const ballOutAnimations = [
      { action: actions["ball.2_roll_out"], name: "ball.2_roll_out" },
      { action: actions["ball.3_roll_out.001"], name: "ball.3_roll_out.001" },
      { action: actions["ball.4_roll_out"], name: "ball.4_roll_out" },
   ]
   const ballAnimations = Array.from({ length: 25 }, (_, i) => actions[`ball_1st_anim_${i}`])

   // Expose startAnimation method to parent component
   useImperativeHandle(ref, () => ({
      startAnimation: () => {

         ballOutAnimations.forEach(({ action, name }) => {
            if (action) {
               action.reset().stop()
            }
         })

         if (rotationAnim) {
            rotationAnim.clampWhenFinished = true
            rotationAnim.setLoop(LoopOnce, 1)
            rotationAnim.reset().play()
            console.log("Wheel animation has started")
         }

         ballAnimations.forEach((ballAnim) => {
            if (ballAnim) {
               ballAnim.clampWhenFinished = true
               ballAnim.setLoop(LoopOnce, 1)
               ballAnim.reset().play()
            }
         })
      }
   }))

   useEffect(() => {

      console.log(actions)
      console.log(materials)

      return () => {
         if (rotationAnim) {
            rotationAnim.stop()
         }

         ballAnimations.forEach((ballAnim) => {
            if (ballAnim) {
               ballAnim.stop()
            }
         })

         ballOutAnimations.forEach(({ action, name }) => {
            if (action) {
               action.stop()
               console.log(`Animation '${name}' stopped`)
            }
         })
      }
   }, [actions, materials])

   useFrame(() => {
      if (rotationAnim) {
         // Check if the animation is near the end of its duration
         if (rotationAnim.getClip().duration - rotationAnim.time < 0.00001) {
            console.log("Wheel animation has ended")
            rotationAnim.stop()

            ballOutAnimations.forEach(({ action, name }) => {
               if (action) {
                  action.clampWhenFinished = true
                  action.setLoop(LoopOnce, 1)
                  action.reset().play()
                  console.log(`Animation '${name}' started`)
               }
            })
         }
      }
   })

   return (
      <group ref={group} position={[0, -5, 0]}>
         <primitive object={scene} />
      </group>
   )
})

Modal.displayName = "Modal"

export default Modal
