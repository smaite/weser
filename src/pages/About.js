import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  };

  const stats = [
    { number: '10K+', label: 'Happy Customers', icon: '👥' },
    { number: '5K+', label: 'Products', icon: '📦' },
    { number: '50+', label: 'Countries', icon: '🌍' },
    { number: '24/7', label: 'Support', icon: '🛟' }
  ];

  const values = [
    {
      title: 'Innovation',
      description: 'We constantly innovate to bring you the latest and greatest products.',
      icon: '💡',
      gradient: 'from-blue-500 to-purple-600'
    },
    {
      title: 'Quality',
      description: 'Every product is carefully selected and tested for the highest quality.',
      icon: '⭐',
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      title: 'Customer First',
      description: 'Your satisfaction is our top priority in everything we do.',
      icon: '❤️',
      gradient: 'from-pink-500 to-red-600'
    },
    {
      title: 'Sustainability',
      description: 'We are committed to sustainable practices and eco-friendly solutions.',
      icon: '🌱',
      gradient: 'from-green-500 to-teal-600'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <motion.section 
        className="relative py-20 px-4 overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
          <motion.div
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
            animate={{
              x: [0, -100, 0],
              y: [0, 50, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>

        <div className="relative max-w-6xl mx-auto text-center">
          <motion.h1 
            className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6"
            variants={itemVariants}
          >
            About Us
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed"
            variants={itemVariants}
          >
            Welcome to <span className="text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text font-semibold">Glorious Trade Hub</span> - 
            where innovation meets excellence. We're not just an e-commerce platform; we're your gateway to the future of shopping.
          </motion.p>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section 
        className="py-16 px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center group"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
              >
                <div className="relative p-8 rounded-2xl bg-gray-900 shadow-lg hover:shadow-xl border border-gray-200 hover:border-purple-400/50 transition-all duration-300">
                  <div className="text-4xl mb-4">{stat.icon}</div>
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
                    {stat.number}
                  </div>
                  <div className="text-gray-400 font-medium">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Our Story Section */}
      <motion.section 
        className="py-20 px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div variants={itemVariants}>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
                Our <span className="text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">Story</span>
              </h2>
              <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
                <p>
                  Founded with a vision to revolutionize online shopping, Glorious Trade Hub emerged from a simple idea: 
                  what if shopping could be more than just a transaction? What if it could be an experience?
                </p>
                <p>
                  We started as a small team of passionate individuals who believed in the power of technology to transform 
                  how people discover, explore, and purchase products. Today, we've grown into a global platform that serves 
                  customers across 50+ countries.
                </p>
                <p>
                  Our journey is driven by innovation, powered by technology, and guided by our commitment to excellence. 
                  Every day, we work to make shopping more intuitive, more personal, and more delightful.
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              className="relative"
              variants={itemVariants}
            >
              <div className="relative p-8 rounded-3xl bg-gray-900 shadow-lg border border-gray-200">
                <div className="aspect-square bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-6xl mb-4">🚀</div>
                    <div className="text-2xl font-bold">Innovation</div>
                    <div className="text-lg opacity-80">Driven</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Values Section */}
      <motion.section 
        className="py-20 px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Our <span className="text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">Values</span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              These core values guide everything we do and shape the way we serve our customers.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                className="group"
                variants={itemVariants}
                whileHover={{ y: -10 }}
              >
                <div className="relative p-8 rounded-2xl bg-gray-900 shadow-lg hover:shadow-xl border border-gray-200 hover:border-purple-400/50 transition-all duration-300">
                  <div className="text-4xl mb-4">{value.icon}</div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
                    {value.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Mission Section */}
      <motion.section 
        className="py-20 px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div 
            className="relative p-12 rounded-3xl bg-gray-900 shadow-lg border border-gray-200"
            variants={itemVariants}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
              Our <span className="text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">Mission</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-8">
              To create the most innovative, user-friendly, and sustainable e-commerce platform that connects 
              people with products they love while building a better future for global commerce.
            </p>
            <div className="inline-flex items-center space-x-4 text-blue-600">
              <span className="text-2xl">🌟</span>
              <span className="text-lg font-semibold">Building Tomorrow's Shopping Experience Today</span>
              <span className="text-2xl">🌟</span>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default About;